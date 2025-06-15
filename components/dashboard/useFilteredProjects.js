// /components/dashboard/useFilteredProjects.js
import { useState, useEffect } from "react";

export function useFilteredProjects({ projects, statusFilter, paidFilter, searchQuery }) {
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    const filtered = projects
      .filter((p) => {
        const matchStatus = statusFilter ? p.status === statusFilter : true;
        const matchPaid = paidFilter ? p.paid === (paidFilter === "true") : true;
        const matchSearch =
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          false;
        return matchStatus && matchPaid && matchSearch;
      })
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    setFilteredProjects(filtered);
  }, [projects, statusFilter, paidFilter, searchQuery]);

  const activeProjects = filteredProjects.filter(
    (p) => !(p.status === "done" && p.paid === true)
  );

  const completedProjects = filteredProjects.filter(
    (p) => p.status === "done" && p.paid === true
  );

  return { activeProjects, completedProjects };
}